from django.db import models

class Food(models.Model):
    food_name = models.CharField(max_length=100)
    native_name = models.CharField(max_length=100)
    description = models.TextField(blank=True,null=True)
    calories = models.FloatField()
    protein = models.FloatField()
    carbohydrates= models.FloatField()
    water= models.FloatField()
    fat= models.FloatField()
    vitamins= models.FloatField()
    fiber= models.FloatField()
    calcium= models.FloatField()
    magnesium= models.FloatField()
    phosphorus= models.FloatField()
    sodium= models.FloatField()
    potassium= models.FloatField()
    iron= models.FloatField()
    zinc= models.FloatField()
    selenium= models.FloatField()
    copper= models.FloatField()
    manganese= models.FloatField()

    def __str__(self):
        return self.food_name
